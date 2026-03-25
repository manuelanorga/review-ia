import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ error: "No autenticado", session: session }, { status: 401 });
  }

  // Debug — ver qué devuelve Google
  const accountsRes = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const accountsData = await accountsRes.json();
  
  return Response.json({ 
    debug: true,
    accessToken: session.accessToken ? "existe" : "no existe",
    accountsData: accountsData 
  });
}