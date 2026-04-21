import supabase from '../config/db.js';
import AppError from '../utils/appError.js';

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(5);
  if (error) throw new AppError(error.message, 500);
  return data;
};

export const addNewScore = async (PlayerName, score, avatar) => {
  const { data, error } = await supabase
    .from('scores')
    .insert({ player_name: PlayerName, score: score, avatar: avatar })
    .select();
  if (error) throw AppError(error.message, 400);
  return data;
};
