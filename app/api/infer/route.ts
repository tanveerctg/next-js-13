import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.chat_model === "davinci") {
    return NextResponse.json({ data: { message: 'Hello, from davinci!' } });
  } else if (body.chat_model === "curie") {
    return NextResponse.json({ data: { message: 'Hello, from curie!' } });
  } else if (body.chat_model === "babbage") {
    return NextResponse.json({ data: { message: 'Hello, from babbage!' } });
  } else if (body.chat_model === "ada") {
    return NextResponse.json({ data: { message: 'Hello, World!' } });
  } else if (body.chat_model === "content-filter-alpha-c4") {
    return NextResponse.json({ data: { message: 'Hello, World!' } });
  } else if (body.chat_model === "content-filter-dev") {
    return NextResponse.json({ data: { message: 'Hello, World!' } });
  } else if (body.chat_model === "content-filter-s3") {
    return NextResponse.json({ data: { message: 'Hello, World!' } });

}
}