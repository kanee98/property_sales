import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

// Protect route with getServerSideProps
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  if (!cookies.adminToken) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  return { props: {} };
};
