using AutoMapper;
using Backend.Domain.DTO;
using Backend.Domain.Entity;

namespace Backend.Request;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}