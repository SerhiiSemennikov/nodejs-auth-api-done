export function catchError(action) {
  return async (req, res, next) => {
    try {
      await action(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
      next(error);
    }
  };
}
