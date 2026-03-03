import { supabase } from "../lib/supabase";

export async function loadUserPreferences(userId) {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error loading user preferences:", error);
    return null;
  }
  return data;
}

export async function saveUserPreferences(userId, preferences) {
  const { data: existing, error: fetchError } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error fetching existing preferences:", fetchError);
    return null;
  }

  const updateFields = { updated_at: new Date().toISOString() };
  
  if (preferences.theme !== undefined && preferences.theme !== null) {
    updateFields.theme = preferences.theme;
  }
  if (preferences.accordionState !== undefined && preferences.accordionState !== null) {
    updateFields.accordion_state = preferences.accordionState;
  }
  if (preferences.currency !== undefined && preferences.currency !== null) {
    updateFields.currency = preferences.currency;
  }

  if (existing) {
    const { data, error } = await supabase
      .from("user_preferences")
      .update(updateFields)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user preferences:", error);
      return null;
    }
    return data;
  } else {
    const insertFields = { user_id: userId };
    if (preferences.theme !== undefined && preferences.theme !== null) {
      insertFields.theme = preferences.theme;
    }
    if (preferences.accordionState !== undefined && preferences.accordionState !== null) {
      insertFields.accordion_state = preferences.accordionState;
    }
    if (preferences.currency !== undefined && preferences.currency !== null) {
      insertFields.currency = preferences.currency;
    }

    const { data, error } = await supabase
      .from("user_preferences")
      .insert(insertFields)
      .select()
      .single();

    if (error) {
      console.error("Error creating user preferences:", error);
      return null;
    }
    return data;
  }
}

export async function loadCalculatorData(userId) {
  const { data, error } = await supabase
    .from("calculator_data")
    .select("data")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error loading calculator data:", error);
    return null;
  }
  return data?.data || null;
}

export async function saveCalculatorData(userId, data) {
  const { data: existing } = await supabase
    .from("calculator_data")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { data: result, error } = await supabase
      .from("calculator_data")
      .update({
        data,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating calculator data:", error);
      return null;
    }
    return result;
  } else {
    const { data: result, error } = await supabase
      .from("calculator_data")
      .insert({
        user_id: userId,
        data,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating calculator data:", error);
      return null;
    }
    return result;
  }
}

export async function loadPayments(userId) {
  const { data, error } = await supabase
    .from("payments")
    .select("payment_data, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error && error.code !== "PGRST116") {
    console.error("Error loading payments:", error);
    return [];
  }
  return data?.map((row) => row.payment_data) || [];
}

export async function savePayments(userId, payments) {
  const { error: deleteError } = await supabase
    .from("payments")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    console.error("Error clearing payments:", deleteError);
  }

  if (payments.length === 0) {
    return true;
  }

  const paymentRecords = payments.map((payment) => ({
    user_id: userId,
    payment_data: payment,
  }));

  const { error } = await supabase.from("payments").insert(paymentRecords);

  if (error) {
    console.error("Error saving payments:", error);
    return false;
  }
  return true;
}

export async function loadCalculatorResults(userId) {
  const { data, error } = await supabase
    .from("calculator_results")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error loading calculator results:", error);
    return null;
  }
  return data;
}

export async function saveCalculatorResults(userId, results) {
  const { data: existing } = await supabase
    .from("calculator_results")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { data: result, error } = await supabase
      .from("calculator_results")
      .update({
        zatak_due: results.zakatDue,
        manual_mode: results.manualMode,
        manual_zakat_due: results.manualZakatDue,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating calculator results:", error);
      return null;
    }
    return result;
  } else {
    const { data: result, error } = await supabase
      .from("calculator_results")
      .insert({
        user_id: userId,
        zatak_due: results.zakatDue,
        manual_mode: results.manualMode,
        manual_zakat_due: results.manualZakatDue,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating calculator results:", error);
      return null;
    }
    return result;
  }
}
