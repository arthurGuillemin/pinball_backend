import supabase from '../config/db.js';
import { AppError } from '../utils/appError.js';

export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select('player_name, score, avatar')
    .order('score', { ascending: false })
    .limit(5);
  if (error) throw new AppError(error.message, 500);
  return data;
};

export const addNewScore = async (playerName, score, avatar) => {
  const { data, error } = await supabase
    .from('scores')
    .insert({ player_name: playerName, score: score, avatar: avatar })
    .select();
  if (error) throw new AppError(error.message, 400);
  return data;
};
