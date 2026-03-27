import supabase from "../config/db.js";

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

export const addNewScore = async (PlayerName, score) => {
  const { data, error } = await supabase
    .from("scores")
    .insert({ player_name: PlayerName, score: score })
    .select();
  if (error) throw error;
  return data;
};
