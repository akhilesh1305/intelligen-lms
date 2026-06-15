import Link from "next/link";
import { Logo } from "./logo";

export function AuthBrand({ href = "/" }: { href?: string }) {
  return <Logo href={href} size="md" inverted />;
}
