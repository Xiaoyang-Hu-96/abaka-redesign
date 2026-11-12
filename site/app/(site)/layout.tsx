import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Column } from "@/components/ui/Grid";

/** Every page shares the same shell: announcement, header and footer inside the 1240 column. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Column>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </Column>
    </>
  );
}
