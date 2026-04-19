export default async function finishOnboarding({ userId, data, supabase }) {
  const { data: familyUserRow, error: fuError } = await supabase
    .from('family_users')
    .select('family_id, id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (fuError || !familyUserRow) {
    throw new Error('family_users-Eintrag nicht gefunden. Bitte erneut versuchen.');
  }

  const { error: roleError } = await supabase
    .from('family_users')
    .update({ role: data.role })
    .eq('id', familyUserRow.id);

  if (roleError) throw roleError;

  for (const entry of data.entries) {
    const { data: childRow, error: childError } = await supabase
      .from('children')
      .insert({
        family_id: familyUserRow.family_id,
        created_by: userId,
        birth_date: entry.birthDate ?? null,
        due_date: entry.dueDate ?? null,
        name: entry.name ?? null,
        gender: entry.gender ?? null,
      })
      .select('id')
      .single();

    if (childError) throw childError;

    if (entry.type === 'pregnancy') {
      const { error: pregError } = await supabase.from('pregnancies').insert({
        child_id: childRow.id,
        due_date: entry.dueDate,
        last_period_date: entry.lastPeriodDate ?? null,
        is_active: true,
        conception_method: 'natural',
      });

      if (pregError) throw pregError;
    }
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      display_name: data.displayName,
      gender: data.gender,
      theme: data.theme,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (profileError) throw profileError;
}
