import useParamStore from "@/store/useParamStore"
import { Pagination, PaginationButton, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "./ui/pagination"

export default function EntriesPagination(props:any) {
    const { total, pagesTotal } = props
    const { offset, setOffset } = useParamStore()
    const currentPage = (offset/20)+1
    const pagesPerGroup = 4
    const handlePageChange = (page:number) => {
        setOffset(page*20-20)
    }
    const getCurrentPageGroup = ( currentPage:number, pagesTotal:number, pagesPerGroup:number ) => {
        let minPage = Math.floor(currentPage / pagesPerGroup) * pagesPerGroup + 1
        if (currentPage % pagesPerGroup === 0) {
            minPage -= pagesPerGroup
        }
        let maxPage = minPage + pagesPerGroup
        if (maxPage > pagesTotal) {
            maxPage = pagesTotal
        }
        const currentPageGroup = []
        for (let i = minPage; i <= maxPage; i++) {
            currentPageGroup.push(i)
        }
        return currentPageGroup
    }
    const currentPageGroup = getCurrentPageGroup(currentPage, pagesTotal, pagesPerGroup)
    return (
        <>
            <h2 className="text-center my-4">Page {currentPage} of {pagesTotal} | {offset+1}-{offset + 20} from {total}</h2>
            <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                    <PaginationPrevious onClick={() => handlePageChange(currentPage-1)} {...(offset <= 0 ? {isActive: true, disabled: true} : {})}/>
                    {currentPageGroup.map((page: number) => (
                        <PaginationItem key={page}>
                            <PaginationButton onClick={() => handlePageChange(page)} {...(currentPage === page ? {isActive: true, disabled: true} : {})}>
                                {page}
                            </PaginationButton>
                        </PaginationItem>
                    ))}
                    <PaginationNext onClick={() => handlePageChange(currentPage+1)} isActive={total - offset <= 20 ? true : false} />
                </PaginationContent>
            </Pagination>
        </>
    )
}
