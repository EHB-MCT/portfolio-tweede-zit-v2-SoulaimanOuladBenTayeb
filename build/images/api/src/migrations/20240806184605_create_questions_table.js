exports.up = function(knex) {
  // The 'up' function is responsible for applying the migration
  return knex.schema.hasTable('questions').then(function(exists) {
      if (!exists) {
          // If the 'questions' table does not exist, create it
          return knex.schema.createTable('questions', function(table) {
              table.increments('id').primary();  // Primary key column 'id' that auto-increments
              table.string('studentName').notNullable();  // Column 'studentName' (string) which is required
              table.text('question').notNullable();  // Column 'question' (text) which is required
              table.string('questionDate').notNullable();  // Column 'questionDate' (string) which is required
              table.text('answer');  // Column 'answer' (text) which is optional
              table.string('answerDate');  // Column 'answerDate' (string) which is optional
              table.string('teacherName');  // Column 'teacherName' (string) which is optional
          });
      }
  });
};

exports.down = function(knex) {
  // The 'down' function is responsible for reverting the migration
  return knex.schema.dropTableIfExists('questions');  // Drop the 'questions' table if it exists
};
