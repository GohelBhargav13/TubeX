import Avatar from "react-avatar"

const UserAvatar = ({ username }) => {
  return (
    <div>
      <Avatar name={username} size="40" round={true} className="size-20 md:size-40 mt-0.5 md:mt-2" />
    </div>
  )
}

export default UserAvatar