const health = async (req, res) => {
    res.status(200).send({ status: 'OK' });
}

export default health;
export * from './ollama/index';