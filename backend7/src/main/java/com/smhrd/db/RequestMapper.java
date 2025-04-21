package com.smhrd.db;

import java.util.List;
import com.smhrd.model.RequestDTO;

public interface RequestMapper {
    public int insertRequest(RequestDTO dto);
    public List<RequestDTO> getAllRequests();
    public RequestDTO getRequestDetail(int req_idx);
}