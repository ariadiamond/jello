import { redirect } from 'next/navigation';
import database from '@/api/database';
import { Company } from '@/api/Models';
import TextInput from '@/app/components/TextInput';

export default function CreateCompany() {
  const onSubmit = async (formState) => {
    'use server';
    const statement = database.prepare('INSERT INTO companies(name, url) VALUES (?, ?) RETURNING ID');
    const{ id } = statement.get(formState.get('name'), formState.get('url'));
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
