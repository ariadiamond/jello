'use client';
import { useState, Suspense, ReactNode } from 'react';

type Status_t = {
  StatusUpdate: ReactNode;
  StatusHistory: ReactNode;
}

export default function Status(props: Status_t) {
  const { StatusUpdate, StatusHistory } = props;
  const [isEditing, setIsEditing] = useState(false);
  return (
    <section>
      <button onClick={() => setIsEditing((edit) => !edit)}>{isEditing ? 'Cancel' : 'Edit'}</button>
      <Suspense>
        {isEditing ? StatusUpdate : StatusHistory}
      </Suspense>
    </section>
  );
}