cube('Actor', {
    sql: `select * from actor`,
  
    measures: {
      count: {
        sql: 'insights_id',
        type: 'count'
      }
    },
  
    dimensions: {
        school_id: {
            sql: 'school_id',
            type: 'string'
        },
                
        insights_id: {
            sql: `insights_id`,
            type: `string`,
            primaryKey: true
      },
    }
  });