import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    certificateId?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const id = searchParams?.certificateId?.trim();

  if (id) {
    redirect(`/verify/${encodeURIComponent(id)}`);
  }

  redirect("/registry");
}