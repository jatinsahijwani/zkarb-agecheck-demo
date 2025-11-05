import { NextResponse } from "next/server"
import { verifyProof } from "zkarb-sdk";
import path from "path"

const setupPath = path.join(process.cwd(), "zk-setup/birthyear")

export async function POST(req: Request) {
  try {
    const { age } = await req.json()
    if (typeof age !== "number") {
      return NextResponse.json({ error: "Invalid age" }, { status: 400 })
    }

    const verified = await verifyProof(
      { age },
      setupPath 
    )

    console.log(verified);

    return NextResponse.json({ verified })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
