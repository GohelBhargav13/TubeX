import Avatar from "react-avatar"

const UserAvatar = ({ username }) => {
  return (
    <div>
      <Avatar name={username} size="40" round={true} />
    </div>
  )
}

export default UserAvatar