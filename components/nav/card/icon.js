export const Icon = ({ icon }) => {
  return (
    <div
      className="w-[52px] h-[52px] rounded-[20px] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${icon})` }}
    />
  );
};
