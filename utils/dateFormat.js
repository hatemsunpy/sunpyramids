// export default function(dateInput, type) {
//   const date = new Date(dateInput);

//   if (type === "date") {
//     console.log(dateInput);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//       year: "numeric",
//     });
//   } else if (type === "time") {
//     return (
//       date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "2-digit",
//         year: "numeric",
//       }) +
//       " at " +
//       date
//         .toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         })
//         .toLowerCase()
//     );
//   } else {
//     return "Invalid type. Use 'date' or 'time'.";
//   }
// }
