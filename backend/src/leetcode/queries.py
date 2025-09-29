profile_query = """
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          userAvatar
          realName
          aboutMe
        }
      }
    }
    """

problem_query = """
    query getProblems($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
        ) {
            total: totalNum
            questions: data {
                acRate
                difficulty
                freqBar
                questionFrontendId
                isFavor
                isPaidOnly
                status
                title
                titleSlug
                topicTags {
                    name
                    id
                    slug
                }
                hasSolution
                hasVideoSolution
            }
        }
}"""

random_question_query = """
      randomQuestionV2($favoriteSlug: String, $categorySlug: String, $searchKeyword: String, $filtersV2: QuestionFilterInput) {
        randomQuestionV2(
          favoriteSlug: $favoriteSlug
          categorySlug: $categorySlug
          filtersV2: $filtersV2
          searchKeyword: $searchKeyword
        ) {
          titleSlug
        }
      }
    """