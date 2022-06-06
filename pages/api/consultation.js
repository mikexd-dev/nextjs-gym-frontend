import { url } from "../../urlConfig";

export default (req, res) => {
  const {
    query: { id, name },
    body,
    headers,
    method,
  } = req;
  switch (method) {
    case "GET":
      fetch(`${url}/consultation`, { headers })
        .then((response) => response.text())
        .then((data) => {
          const result = JSON.parse(data);
          if (result.status === "success") {
            res.status(200).json(result);
          } else {
            res.status(500).json(result);
          }
        });
      break;
    case "PUT":
      // Update or create data in your database
      res.status(200).json({ id, name: name || `User ${id}` });
      break;
    case "POST":
      fetch(`${url}/consultation`, {
        headers,
        method,
        body: JSON.stringify(body),
      })
        .then((response) => response.text())
        .then((data) => {
          const result = JSON.parse(data);
          if (result.status === "success") {
            res.status(200).json(result);
          } else {
            res.status(500).json(result);
          }
        });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
