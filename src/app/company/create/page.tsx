import { redirect } from 'next/navigation';
import { Company } from '@/api/Models';
import TextInput from '@/app/components/TextInput';

export default function CreateCompany() {
  const onSubmit = async (formState) => {
    'use server';
    const { id } = Company().create({
      name: formState.get('name'),
      url: formState.get('url')
    });
    redirect(`/company/${id}`);
  }

  return (
    <div className="">
      <main>
        <h1>Create Company</h1>
        <form action={onSubmit} className="flex h-screen justify-around flex-col items-center">
          <TextInput type="text" formKey="name" label="Company Name" />
          <TextInput type="url" formKey="url" label="Company Url" />
          <button type="submit">Create!</button>
        </form>
      </main>
    </div>
  );
}
