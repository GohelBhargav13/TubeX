
import { useUserAuthStore } from "../store/auth.store.js"

const HomePage = () => {
const { userData } = useUserAuthStore()
  return (
    <div>
      <span>{ userData?.userFirstName }</span>
    </div>
  )
}

export default HomePage