using static System.Runtime.InteropServices.JavaScript.JSType;
using AutoMapper;
using CrazyDayZ.Promo.Models;
using CrazyDayZ.Promo.Models.Dto;

namespace CrazyDayZ.Promo.Extensions;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Image, PostImageDto>();

    }
}
