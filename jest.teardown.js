module.exports = async () => {
  // Give time for all connections to close
  await new Promise(resolve => setTimeout(resolve, 500));
};

