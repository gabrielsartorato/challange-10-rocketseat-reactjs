import React, { useRef, useCallback } from 'react';

import * as Yup from 'yup';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import api from '../../services/api';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {

      const schema = Yup.object().shape({
        image: Yup.string()
        .matches(
            /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
            'Enter correct url!'
        )
        .required('Please enter website'),
        name: Yup.string().required(),
        price: Yup.string().required(),
        description: Yup.string().required(),
      })

      await schema.validate(data);

      const formFood = {
        name: data.name,
        image: data.image,
        price: data.price,
        description: data.description,
        available: true
      }

      const responseFood = await api.post<IFoodPlate>('/foods', formFood);

      handleAddFood(responseFood.data)

      setIsOpen();
    },
    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
