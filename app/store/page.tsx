import { redirect } from "next/navigation";

export default function StorePage() {
  // No session check here (handled in layout)
  redirect("/store/ranks");
}
