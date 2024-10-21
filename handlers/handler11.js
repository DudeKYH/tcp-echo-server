const handler11 = (data) => {
  const processedData = ''.concat(...[...data.toString()].reverse());
  return Buffer.from(processedData);
};

export default handler11;
