import { combineReducers } from "@reduxjs/toolkit"
import EducationReducer from "./EducationReducer"
import ExperienceReducer from "./ExperienceReducer"
import ServiceReducer from "./ServiceReducer"
import SkillReducer from "./SkillReducer"
import CertificateReducer from "./CertificateReducer"
import PortfolioReducer from "./PortfolioReducer"
import ContactUsReducer from "./ContactUsReducer"
import TestimonialReducer from "./TestimonialReducer"
import BlogReducer from "./BlogReducer"
import ResumeReducer from "./ResumeReducer"
import NewsletterReducer from "./NewsletterReducer"
import CommentReducer from "./CommentReducer"


export default combineReducers({
    EducationStateData: EducationReducer,
    ExperienceStateData: ExperienceReducer,
    ServiceStateData: ServiceReducer,
    TestimonialStateData: TestimonialReducer,
    SkillStateData: SkillReducer,
    CertificateStateData: CertificateReducer,
    ContactUsStateData: ContactUsReducer,
    PortfolioStateData: PortfolioReducer,
    BlogStateData: BlogReducer,
    ResumeStateData : ResumeReducer,
    NewsletterStateData : NewsletterReducer,
    CommentStateData : CommentReducer
})