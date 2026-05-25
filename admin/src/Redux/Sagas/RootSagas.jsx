import { all } from "redux-saga/effects"
import educationSagas from "./EducationSagas"
import experienceSagas from "./ExperienceSagas"
import serviceSagas from "./ServiceSagas"
import certificateSagas from "./CertificateSagas"
import contactUsSagas from "./ContactUsSagas"
import portfolioSagas from "./PortfolioSagas"
import skillSagas from "./SkillSagas"
import testimonialSagas from "./TestimonialSagas"
import blogSagas from "./BlogSagas"
import resumeSagas from "./ResumeSagas"
import newsletterSagas from "./NewsletterSagas"
import commentSagas from "./CommentSagas"


export default function* RootSaga() {
    yield all([
        educationSagas(),
        experienceSagas(),
        serviceSagas(),
        certificateSagas(),
        contactUsSagas(),
        portfolioSagas(),
        skillSagas(),
        testimonialSagas(),
        blogSagas(),
        resumeSagas(),
        newsletterSagas(),
        commentSagas()
    ])
}