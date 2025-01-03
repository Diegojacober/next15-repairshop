import { redirect } from "next/navigation";

export const metadata = {
  title: "Home",
};

function Home() {
  redirect("/tickets");
}

export default Home;
