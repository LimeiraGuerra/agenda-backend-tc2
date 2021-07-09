const bcrypt = require('bcrypt');

module.exports = mongoose => {
  const Event = new mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
        type: Date, // "1995-12-17T03:24:00" padrão
        require: true,
      },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
  },

  );

  return mongoose.model("event", Event);
};