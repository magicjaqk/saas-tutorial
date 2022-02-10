import axios from "axios";

const getUser = () => {
  let data;
  const getData = async () => {
    data = await axios.get("/api/get-user");
  };
  getData();

  console.log(data);

  return data;
};

export { getUser };
