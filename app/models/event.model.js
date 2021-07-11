const bcrypt = require('bcrypt');

module.exports = mongoose => {
  const Event = new mongoose.Schema({
    description: {
      type: String,
      require: true,
    },
    startDate: {
      type: String,
      require: true,
    },
    endDate: {
        type: String,
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