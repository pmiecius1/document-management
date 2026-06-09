import Editor from "./Editor";

export default async function DocPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Editor id={Number(id)} />;
}
