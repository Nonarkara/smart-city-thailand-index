interface ReadingNote { id: string; label: string; body: string; meta: string }
export default function DossierReadingNotes({ notes }: { notes: ReadingNote[] }) {
  // Preserve each editorial role and qualification, but print identical prose once.
  const groups: { body: string; notes: ReadingNote[] }[] = [];
  for (const note of notes) {
    const group = groups.find(group => group.body === note.body);
    if (group) group.notes.push(note);
    else groups.push({ body: note.body, notes: [note] });
  }
  return <div className="city-dossier-grid">{groups.map(group => <article key={group.notes[0].id} className="city-dossier-card">
    <span className="city-dossier-card-label">{group.notes.map(note => note.label).join(' / ')}</span>
    <p className="city-dossier-card-body">{group.body}</p>
    {Array.from(new Set(group.notes.map(note => note.meta))).map(meta => <span key={meta} className="city-dossier-card-meta">{meta}</span>)}
  </article>)}</div>;
}
