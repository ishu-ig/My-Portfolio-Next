import { GET_RESUME_RED} from "../Constants"
export default function SkillReducer(state=[], action) {
    switch (action.type) {
        

        case GET_RESUME_RED:
            return action.payload


        default:
            return state
    }
}   
