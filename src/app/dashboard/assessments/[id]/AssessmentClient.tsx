'use client';

interface AssessmentClientProps {
  assessmentId: string;
}

export default function AssessmentClient({ assessmentId }: AssessmentClientProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Assessment Details</h1>
      <p className="text-muted-foreground">Assessment ID: {assessmentId}</p>
      <div className="mt-4">(Assessment details would be shown here.)</div>
    </div>
  );
} 