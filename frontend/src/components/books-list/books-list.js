import { useState, useEffect } from "react"
import { Link as RouterLink, resolvePath } from "react-router-dom"
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination,
    Container,
} from "@mui/material"
import { BackendApi } from "../../client/backend-api"
import { useUser } from "../../context/user-context"
import classes from "./styles.module.css"

export const BooksList = () => {

    const [books, setBooks] = useState([]);
    const [borrowedBook, setBorrowedBook] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [activeBookIsbn, setActiveBookIsbn] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const { isAdmin, user } = useUser()
    const [activeTab, setActiveTab] = useState('book-list')


    const fetchBooks = async () => {
        const { books } = await BackendApi.book.getAllBooks()
        setBooks(books)
    }

    const fetchUserBook = async () => {
        const { books } = await BackendApi.user.getBorrowBook()
        setBorrowedBook(books)
    }

    const deleteBook = () => {
        if (activeBookIsbn && books.length) {
            BackendApi.book.deleteBook(activeBookIsbn).then(({ success }) => {
                fetchBooks().catch(console.error)
                setOpenModal(false)
                setActiveBookIsbn("")
            })
        }
    }

    useEffect(() => {
        fetchBooks().catch(console.error)
        fetchUserBook().catch(console.error)
    }, [user])

    return (
        
        <div style={{width:'90%',margin:'auto'}}>

            <div className={`${classes.pageHeader} ${classes.mb2}`}>
                <span style={{display:'flex', gap:'40px'}}>
                <Typography variant="h5" style={{cursor:'pointer'}} color={activeTab=="book-list" ? 'blue': 'black'} onClick={()=>setActiveTab('book-list')}>Book List</Typography>
                { user && !isAdmin && <Typography variant="h5" style={{cursor:'pointer'}} color={activeTab=="borrowed-books" ? 'blue': 'black'} onClick={()=>setActiveTab('borrowed-books')}>Borrowed Books</Typography>}
                </span>
                {isAdmin && (
                    <Button variant="contained" color="primary" component={RouterLink} to="/admin/books/add">
                        Add Book
                    </Button>
                )}
            </div>
            { activeTab == "book-list" && (books.length > 0 ? (
                <>
                    <div style={{display: 'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', columnGap:'20px'}}>
                        {books.map((book) => 
                            <>
                            <Container width="100px" height="100px" component={Paper} style={{margin:'10px', paddingBottom:'15px', minWidth:'250px', flexShrink:'0'}}>
                                <div>
                                    <p style={{fontSize:'20px', fontWeight:'bold'}}>{book.name}</p>
                                    <p>ISBN: {book.isbn}</p>
                                    <p>Quantity: {book.quantity}</p>
                                    <p>Available: {book.availableQuantity}</p>
                                    <p>Price: ${book.price}</p>
                                    <div className={classes.actionsContainer}>
                                                    <Button
                                                        variant="contained"
                                                        component={RouterLink}
                                                        size="small"
                                                        to={`/books/${book.isbn}`}
                                                    >
                                                        View
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                component={RouterLink}
                                                                size="small"
                                                                to={`/admin/books/${book.isbn}/edit`}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    setActiveBookIsbn(book.isbn)
                                                                    setOpenModal(true)
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                </div>
                            </Container>
                            </>
                        )}
                        <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                            <Card className={classes.conf_modal}>
                                <CardContent>
                                    <h2>Are you sure?</h2>
                                </CardContent>
                                <CardActions className={classes.conf_modal_actions}>
                                    <Button variant="contained" onClick={() => setOpenModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={deleteBook}>
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        </Modal>
                    </div>

                </>
            ) : (
                <Typography variant="h5">No books found!</Typography>
            ))}

            {
                user && !isAdmin && activeTab == "borrowed-books" && (
                    <>
                        {borrowedBook.length > 0 ? (
                            <>
                                <div style={{display: 'grid',  gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', columnGap:'20px'}}>
                        {borrowedBook.map((book) => 
                            <>
                            <Container component={Paper} style={{margin:'10px', paddingBottom:'15px', width:'250px', flexShrink:'0'}}>
                                <div>
                                    <p style={{fontSize:'20px', fontWeight:'bold'}}>{book.name}</p>
                                    <p>ISBN: {book.isbn}</p>
                                    <p>Quantity: {book.quantity}</p>
                                    <p>Available: {book.availableQuantity}</p>
                                    <p>Price: ${book.price}</p>
                                    <div className={classes.actionsContainer}>
                                                    <Button
                                                        variant="contained"
                                                        component={RouterLink}
                                                        size="small"
                                                        to={`/books/${book.isbn}`}
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                </div>
                            </Container>
                            </>
                        )}
                    </div>

                                
                            </>
                        ) : (
                            <Typography variant="h5">No books issued!</Typography>
                        )}
                    </>
                )
            }
        </div>
   
    )
}