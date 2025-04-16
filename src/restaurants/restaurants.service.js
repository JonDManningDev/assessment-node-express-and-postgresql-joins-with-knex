const knex = require("../db/connection");

const tableName = "restaurants";

function averageRating() {
  return knex(tableName).avg("rating").as("average").first();
}

function count() {
  return knex(tableName).count("restaurant_id").first();
}

function create(newRestaurant) {
  return knex(tableName)
    .insert(newRestaurant, "*")
    .then((createdRecords) => createdRecords[0]);
}

function destroy(restaurant_id) {
  return knex(tableName).where({ restaurant_id }).del();
}

function list() {
  return knex(`${tableName} as r`)
    .select("restaurant_name", "owner_name", "email")
    .join("owners as o", "r.owner_id", "o.owner_id")
    .orderBy("owner_name");
}

async function listAverageRatingByOwner() {
  const response = await knex(`${tableName} as r`)
    .join("owners as o", "r.owner_id", "o.owner_id")
    .select("o.owner_name")
    .avg("rating")
    .groupBy("o.owner_name");

  return response.map((owner) => ({
    ...owner,
    avg: Number(owner.avg),
  }));
}

function read(restaurant_id) {
  return knex(tableName).select("*").where({ restaurant_id }).first();
}

function readHighestRated() {
  return knex(tableName)
    .max("rating")
    .select("*")
    .groupBy("rating", "restaurant_id")
    .orderBy("rating", "desc")
    .first();
}

function update(updatedRestaurant) {
  return knex(tableName)
    .select("*")
    .where({ restaurant_id: updatedRestaurant.restaurant_id })
    .update(updatedRestaurant, "*");
}

module.exports = {
  averageRating,
  count,
  create,
  delete: destroy,
  list,
  listAverageRatingByOwner,
  read,
  readHighestRated,
  update,
};
