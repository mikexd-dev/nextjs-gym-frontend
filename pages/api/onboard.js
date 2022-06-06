// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { url } from "../config";

// export default (req, res) => {
//   console.log(url, "url");
//   fetch(`${url}/onboard`, { headers: req.headers })
//     .then((response) => response.text())
//     .then((data) => {
//       const result = JSON.parse(data);
//       if (result.status === "success") {
//         res.status(200).json(result);
//       } else {
//         res.status(500).json(result);
//       }
//     });
// };

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { url } from "../../urlConfig";

export default (req, res) => {
  const {
    query: { id, name },
    headers,
    method,
  } = req;
  switch (method) {
    case "GET":
      fetch(`${url}/onboard`, { headers })
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
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
