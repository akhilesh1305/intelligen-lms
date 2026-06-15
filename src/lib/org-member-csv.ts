import type { OrganizationRole } from "@prisma/client";

import { normalizePhoneNumber } from "@/lib/phone";

export type CsvMemberRow = {
  line: number;
  email: string;
  name: string;
  employeeId: string;
  role: OrganizationRole;
  department?: string;
  location?: string;
  phoneNumber?: string;
};

export type CsvParseError = {
  line: number;
  message: string;
};

const ROLE_MAP: Record<string, OrganizationRole> = {
  org_learner: "ORG_LEARNER",
  learner: "ORG_LEARNER",
  student: "ORG_LEARNER",
  org_instructor: "ORG_INSTRUCTOR",
  instructor: "ORG_INSTRUCTOR",
  org_admin: "ORG_ADMIN",
  admin: "ORG_ADMIN",
};

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function findColumnIndex(
  headerCells: string[],
  aliases: string[]
): number {
  return headerCells.findIndex((h) => aliases.includes(h));
}

export function parseMemberCsv(csvText: string): {
  rows: CsvMemberRow[];
  errors: CsvParseError[];
} {
  const lines = csvText
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], errors: [{ line: 0, message: "CSV file is empty" }] };
  }

  const headerCells = parseCsvLine(lines[0]).map(normalizeHeader);
  const emailIdx = findColumnIndex(headerCells, [
    "email",
    "email_address",
    "work_email",
  ]);
  const nameIdx = findColumnIndex(headerCells, [
    "name",
    "full_name",
    "employee_name",
  ]);
  const employeeIdIdx = findColumnIndex(headerCells, [
    "employee_id",
    "employeeid",
    "emp_id",
    "id",
    "staff_id",
  ]);
  const roleIdx = findColumnIndex(headerCells, ["role", "org_role"]);
  const departmentIdx = findColumnIndex(headerCells, [
    "department_name",
    "department",
    "dept",
  ]);
  const locationIdx = findColumnIndex(headerCells, [
    "location",
    "office",
    "office_location",
  ]);
  const phoneIdx = findColumnIndex(headerCells, [
    "phone_number",
    "phone",
    "mobile",
  ]);

  if (emailIdx === -1) {
    return {
      rows: [],
      errors: [{ line: 1, message: "Missing required column: email" }],
    };
  }
  if (employeeIdIdx === -1) {
    return {
      rows: [],
      errors: [{ line: 1, message: "Missing required column: employee_id" }],
    };
  }

  const rows: CsvMemberRow[] = [];
  const errors: CsvParseError[] = [];
  const seenEmails = new Set<string>();
  const seenEmployeeIds = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const cells = parseCsvLine(lines[i]);
    const email = (cells[emailIdx] ?? "").trim().toLowerCase();
    const employeeId = (cells[employeeIdIdx] ?? "").trim();
    const name = (nameIdx >= 0 ? cells[nameIdx] : "").trim();
    const roleRaw = (roleIdx >= 0 ? cells[roleIdx] : "ORG_LEARNER")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
    const department =
      departmentIdx >= 0 ? (cells[departmentIdx] ?? "").trim() : "";
    const location =
      locationIdx >= 0 ? (cells[locationIdx] ?? "").trim() : "";
    const phoneRaw = phoneIdx >= 0 ? (cells[phoneIdx] ?? "").trim() : "";

    if (!email) {
      errors.push({ line: lineNumber, message: "Email is required" });
      continue;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ line: lineNumber, message: `Invalid email: ${email}` });
      continue;
    }
    if (!employeeId) {
      errors.push({ line: lineNumber, message: "employee_id is required" });
      continue;
    }
    if (seenEmails.has(email)) {
      errors.push({ line: lineNumber, message: `Duplicate email in file: ${email}` });
      continue;
    }
    if (seenEmployeeIds.has(employeeId)) {
      errors.push({
        line: lineNumber,
        message: `Duplicate employee_id in file: ${employeeId}`,
      });
      continue;
    }

    const role = ROLE_MAP[roleRaw] ?? (roleRaw.toUpperCase() as OrganizationRole);
    if (!["ORG_LEARNER", "ORG_INSTRUCTOR", "ORG_ADMIN"].includes(role)) {
      errors.push({ line: lineNumber, message: `Invalid role: ${roleRaw}` });
      continue;
    }

    let phoneNumber: string | undefined;
    if (phoneRaw) {
      const normalized = normalizePhoneNumber(phoneRaw);
      if (!normalized) {
        errors.push({
          line: lineNumber,
          message: `Invalid phone number: ${phoneRaw}`,
        });
        continue;
      }
      phoneNumber = normalized;
    }

    seenEmails.add(email);
    seenEmployeeIds.add(employeeId);
    rows.push({
      line: lineNumber,
      email,
      name: name || email.split("@")[0],
      employeeId,
      role,
      ...(department ? { department } : {}),
      ...(location ? { location } : {}),
      ...(phoneNumber ? { phoneNumber } : {}),
    });
  }

  return { rows, errors };
}

export const MEMBER_CSV_TEMPLATE = `email,name,employee_id,role,department,location,phone_number
jane.doe@acme.com,Jane Doe,EMP-1001,ORG_LEARNER,Engineering,San Francisco,4155550101
john.smith@acme.com,John Smith,EMP-1002,ORG_INSTRUCTOR,Product,New York,2125550199`;
