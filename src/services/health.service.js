import supabase from "../config/db.js";
import AppError from "../utils/appError.js";

export const getHealth = async () => {
  const { data, error } = await supabase.rpc("healthcheck");

  if (error) {
    throw new AppError(error.message, 500);
  }

  return data;
};
