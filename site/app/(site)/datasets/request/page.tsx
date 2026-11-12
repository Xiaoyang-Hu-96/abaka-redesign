import { redirect } from "next/navigation";

/** Request a dataset is the contact form with Datasets picked, so the link lands there directly. */
export default function RequestDatasetPage() {
  redirect("/contact?need=Datasets");
}
