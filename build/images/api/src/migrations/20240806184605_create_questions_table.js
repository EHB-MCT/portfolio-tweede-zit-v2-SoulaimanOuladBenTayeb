exports.up = function(knex) {
    return knex.schema.hasTable('questions').then(function(exists) {
      if (!exists) {
        return knex.schema.createTable('questions', function(table) {
          table.increments('id').primary();
          table.string('studentName').notNullable();
          table.text('question').notNullable();
          table.string('questionDate').notNullable();
          table.text('answer');
          table.string('answerDate');
          table.string('teacherName');
        });
      }
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('questions');
  };
  