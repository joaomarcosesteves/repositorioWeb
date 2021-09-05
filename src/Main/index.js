import React, {useState, useCallback, useEffect} from  'react'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, Form, SubmitButton, List, DeleteButton } from './styles'
import { Link } from 'react-router-dom'

import api from '../services/api'

export default function Main(){

    const [ newRepository, SetNewRepository ] = useState('');
    const [ repositorios, SetRepoitorios ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ alert, setAlert ] = useState(null);

    //DidMount, Inicia componente busca no Storage
    useEffect(() => {
        const repStorage = localStorage.getItem('repos')

        if(repStorage){
            SetRepoitorios(JSON.parse(repStorage))
        }
    }, []);

    //DidUpdate, Se alterar o state, atualiza no Storage
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);


    function handleInputChange(e){
        SetNewRepository(e.target.value);
        setAlert(null)
    }

    const handleSubmit = useCallback((e)=>{
        e.preventDefault();
        
        async function submit(){       
            setLoading(true);
            setAlert(null);
            try{

                if( newRepository === ''){
                    throw new Error('Campo vazio!')
                }

                const response = await api.get(`repos/${newRepository}`);

                const hasRep = repositorios.find(rep => rep.name === newRepository)

                if(hasRep){
                    throw new Error('Repositórios Duplicados!')
                }

                const data = {
                    name: response.data.full_name,
                }
                
                SetRepoitorios([...repositorios, data]);
                SetNewRepository('');
            }catch(error){
                setAlert(true)
                console.log(error);
            }finally{
                setLoading(false);
            }
        }

        submit();

    }, [ newRepository, repositorios ])

    const HandleDelete = useCallback((rep) => {
        const find = repositorios.filter(r => r.name !== rep);
        SetRepoitorios(find);
    }, [repositorios])

    return(
        <Container>
            <h1> 
                <FaGithub size={25}/>
                Meus Repositorios 
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type="text" 
                placeholder="Adicionar Repositórios (ex: facebook/react)"
                value={newRepository}
                onChange={handleInputChange}
                />

                <SubmitButton loading={loading ? 1 : 0} onClick={handleSubmit}>
                    {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                </SubmitButton>
            
            </Form>
        
            <List>
                {repositorios.map(rep => (
                    <li key={rep.name}>
                        <span>
                            <DeleteButton onClick={() => HandleDelete(rep.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {rep.name}
                        </span>
                        <Link to={`/repositorio/${encodeURIComponent(rep.name)}`}>
                            <FaBars size={20}/>
                        </Link>

                    </li>
                ))}

            </List>
        </Container>
    )
}