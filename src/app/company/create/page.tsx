import { redirect } from "next/navigation";
import { Company } from "@/api/Models";
import TextInput from "@/app/components/TextInput";

export default function CreateCompany() {
  const onSubmit = async (formState: FormData) => {
    "use server";
    const { id } = Company().create({
      name: formState.get("name"),
      url: formState.get("url"),
    });
    redirect(`/company/${id}`);
  };

  return (
    <>
      <h1>Create Company</h1>
      <form action={onSubmit}>
        <div>
          <TextInput type="text" formKey="name" label="Company Name" />
          <TextInput type="url" formKey="url" label="Company Url" />
          <div className="flex justify-center">
            <button type="submit">Create!</button>
          </div>
        </div>
      </form>
    </>
  );
}
