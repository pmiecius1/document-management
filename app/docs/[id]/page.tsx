import EditorClient from "./EditorClient";

export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditorClient id={Number(id)} />;
}
